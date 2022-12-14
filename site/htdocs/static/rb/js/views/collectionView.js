"use strict";

/**
 * An abstract view for rendering a collection.
 *
 * This provides core, reusable functionality for any view that wants to render
 * a collection and respond to add/remove events. Types that extend this should
 * make sure to define the 'itemViewType' attribute, which will be the view
 * instantiated for each model in the collection.
 *
 * Items are added to the view's :js:attr:`RB.CollectionView.$container`
 * element. By default, this is the view's :js:attr:`RB.CollectionView.$el`
 * element. Subclasses that want to add to an inner child should explicitly
 * set ``$container`` to the appropriate element.
 */
RB.CollectionView = Backbone.View.extend({
  /**
   * The view that will be instantiated for rendering items in the collection.
   */
  itemViewType: null,

  /**
   * Initialize the CollectionView.
   *
   * Args:
   *     options (object):
   *         Options for the view.
   *
   * Option Args:
   *     collection (Backbone.Collection):
   *         The collection to display.
   *
   *     itemViewType (function):
   *         The constructor for the child views.
   *
   *     itemViewOptions (object):
   *         Options to pass into the item view constructor.
   */
  initialize(options) {
    if (options.itemViewType) {
      this.itemViewType = options.itemViewType;
    }

    this.itemViewOptions = options.itemViewOptions || {};
    const collection = options.collection;
    this.collection = collection;
    this.views = [];
    this._viewsByModelID = {};
    collection.each(this._onAdded, this);
    this.listenTo(collection, 'add', this._onAdded);
    this.listenTo(collection, 'remove', this._onRemoved);
    this.listenTo(collection, 'sort', this._onSorted);
    this.listenTo(collection, 'reset', this._onReset);
    this.$container = this.$el;
  },

  /**
   * Render the view.
   *
   * This will iterate over all the child views and render them as well.
   *
   * Returns:
   *     RB.CollectionView:
   *     This object, for chaining.
   */
  render() {
    this._rendered = true;
    this.$container.empty();

    this._addCollectionViews();

    return this;
  },

  /**
   * Add each view to the collection's container.
   *
   * This will iterate through all views and append them to the container.
   */
  _addCollectionViews() {
    this.views.forEach(view => this.$container.append(view.render().el));
  },

  /**
   * Add a view for an item in the collection.
   *
   * This will instantiate the itemViewType, and if the CollectionView has
   * been rendered, render and append it as well.
   *
   * Args:
   *     item (Backbone.Model):
   *         The item to add.
   */
  _onAdded(item) {
    console.assert(this.itemViewType, 'itemViewType must be defined by the subclass');
    const view = new this.itemViewType(_.defaults({
      model: item
    }, this.itemViewOptions));
    this.views.push(view);
    this._viewsByModelID[item.cid] = view;

    if (this._rendered) {
      this.$container.append(view.render().el);
    }
  },

  /**
   * Remove a view for an item in the collection.
   *
   * Args:
   *     item (Backbone.Model):
   *         The item to remove.
   */
  _onRemoved(item) {
    const toRemove = this._viewsByModelID[item.cid];

    if (toRemove) {
      delete this._viewsByModelID[item.cid];
      this.views = _.without(this.views, toRemove);

      if (this._rendered) {
        toRemove.remove();
      }
    }
  },

  /**
   * Respond to a change in the collection's sort order.
   *
   * This will detach all of the child views and re-add them in the new
   * order.
   */
  _onSorted() {
    let views = this.views;
    /*
     * See if the order of models has changed from our views. This may
     * not be the case. An initial collection.fetch() will add each
     * model and then emit a "sort", and this can end up causing us to
     * rebuild our list of views unnecessarily (which can be problematic
     * for, say, <option selected> items, as the 'selected' attribute
     * will no longer be respected).
     */

    const models = this.collection.models;
    const oldViews = this.views;
    let orderChanged = false;

    if (models.length === oldViews.length) {
      for (let i = 0; i < oldViews.length; i++) {
        if (oldViews[i].model !== models[i]) {
          orderChanged = true;
          break;
        }
      }
    } else {
      orderChanged = true;
    }

    if (!orderChanged) {
      return;
    }

    this.views = this.collection.map(model => this._viewsByModelID[model.cid]);

    if (this._rendered) {
      this.$container.children().detach();

      this._addCollectionViews();
    }
  },

  /**
   * Handle the collection being reset.
   *
   * This will remove all existing views and create new ones for the new
   * state of the collection.
   */
  _onReset() {
    this.views.forEach(view => view.remove());
    this.views = [];
    this._viewsByModelID = {};
    this.collection.each(this._onAdded, this);
  }

});

//# sourceMappingURL=collectionView.js.map