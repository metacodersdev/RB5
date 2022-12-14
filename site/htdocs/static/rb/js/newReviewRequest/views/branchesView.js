"use strict";

/**
 * A view for a collection of branches.
 *
 * This is presented as a ``<select>`` in the document.
 *
 * Users can listen to the "selected" event to know which branch is currently
 * chosen. This event will be triggered with the branch model as its argument.
 */
RB.BranchesView = RB.CollectionView.extend({
  tagName: 'select',
  itemViewType: RB.BranchView,
  events: {
    'change': '_onChange'
  },

  /**
   * Render the view.
   *
   * Returns:
   *     RB.BranchesView:
   *     This object, for chaining.
   */
  render: function () {
    RB.CollectionView.prototype.render.apply(this, arguments);
    this.collection.each(branch => {
      if (branch.get('isDefault')) {
        this.trigger('selected', branch);
      }
    });
    return this;
  },

  /**
   * Override for CollectionView._onAdded.
   *
   * If the newly-added branch is the default (for example, 'trunk' in SVN or
   * 'master' in git), start with it selected.
   *
   * Args:
   *     branch (RB.RepositoryBranch):
   *         The newly-added branch.
   */
  _onAdded(branch) {
    RB.CollectionView.prototype._onAdded.apply(this, arguments);

    if (this._rendered && branch.get('isDefault')) {
      this.trigger('selected', branch);
    }
  },

  /**
   * Callback for the 'change' event on the select node.
   *
   * Triggers 'selected' with the given model.
   */
  _onChange() {
    const selectedIx = this.$el.prop('selectedIndex');
    this.trigger('selected', this.collection.models[selectedIx]);
  }

});

//# sourceMappingURL=branchesView.js.map