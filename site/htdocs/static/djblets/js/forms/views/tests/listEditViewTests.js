"use strict";

suite('djblets/forms/views/ListEditView', function () {
  const formTemplate = _.template("<div class=\"djblets-c-list-edit-widget list-edit-widget\">\n<input type=\"hidden\" name=\"_num_rows\" value=\"<%- renderedRows.length %>\">\n  <ul class=\"djblets-c-list-edit-widget__entries\">\n  <% if (renderedRows.length > 0) { %>\n    <% renderedRows.forEach(function(row, i) { %>\n    <li class=\"djblets-c-list-edit-widget__entry\"\n        data-list-index=\"<%- i %>\">\n    <%= row %>\n    <a href=\"#\" class=\"djblets-c-list-edit-widget__remove-item\"\n        role=\"button\">\n    <span class=\"fa fa-times\"></span>\n    </a>\n    </li>\n  <% }); %>\n  <% } else { %>\n    <li class=\"djblets-c-list-edit-widget__entry\" data-list-index=\"0\">\n    <%= renderedDefaultRow %>\n    <a href=\"#\" class=\"djblets-c-list-edit-widget__remove-item\"></a>\n    </li>\n  <% } %>\n  </ul>\n <button class=\"djblets-c-list-edit-widget__add-item btn\" role=\"button\">\n <span class=\"fa fa-plus\"></span>\n </button>\n</div>");

  const makeView = function makeView() {
    let renderedRows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let renderedDefaultRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[0]\" />";
    const $el = $(formTemplate({
      renderedRows: renderedRows,
      renderedDefaultRow: renderedDefaultRow
    })).appendTo($testsScratch);
    const view = new Djblets.Forms.ListEditView({
      el: $el,
      renderedDefaultRow: renderedDefaultRow,
      fieldName: '',
      removeText: 'Remove this item.'
    });
    view.render();
    return [view, view.$('input[name="_num_rows"]')];
  };

  describe('Removal', function () {
    it('With no values', function () {
      const [view, $numRows] = makeView([]);
      expect($numRows.val()).toEqual('1');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(1);
      expect(view.$('.djblets-c-list-edit-widget__input').val()).toEqual('');
      expect(view.$('.djblets-c-list-edit-widget__input').attr('name')).toEqual('_value[0]');
      view.$('.djblets-c-list-edit-widget__remove-item').click();
      expect($numRows.val()).toEqual('1');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(1);
      expect(view.$('.djblets-c-list-edit-widget__input').val()).toEqual('');
      expect(view.$('.djblets-c-list-edit-widget__input').attr('name')).toEqual('_value[0]');
    });
    it('With one value', function () {
      const [view, $numRows] = makeView(["<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[0]\"\nvalue=\"One\" />"]);
      expect($numRows.val()).toEqual('1');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(1);
      expect(view.$('.djblets-c-list-edit-widget__input').val()).toEqual('One');
      expect(view.$('.djblets-c-list-edit-widget__input').attr('name')).toEqual('_value[0]');
      view.$('.djblets-c-list-edit-widget__remove-item').click();
      expect($numRows.val()).toEqual('1');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(1);
      expect(view.$('.djblets-c-list-edit-widget__input').val()).toEqual(''); // this might not work? val might not even be there

      expect(view.$('.djblets-c-list-edit-widget__input').attr('name')).toEqual('_value[0]');
    });
    it('With multiple values', function () {
      const [view, $numRows] = makeView(["<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[0]\"\nvalue=\"One\" />", "<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[1]\"\nvalue=\"Two\" />", "<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[2]\"\nvalue=\"Three\" />"]);
      expect($numRows.val()).toEqual('3');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(3);
      expect(view.$('.djblets-c-list-edit-widget__remove-item').length).toEqual(3);
      let $inputOne = view.$('.djblets-c-list-edit-widget__input').eq(0);
      expect($inputOne.val()).toEqual('One');
      expect($inputOne.attr('name')).toEqual('_value[0]');
      let $inputTwo = view.$('.djblets-c-list-edit-widget__input').eq(1);
      expect($inputTwo.val()).toEqual('Two');
      expect($inputTwo.attr('name')).toEqual('_value[1]');
      let $inputThree = view.$('.djblets-c-list-edit-widget__input').eq(2);
      expect($inputThree.val()).toEqual('Three');
      expect($inputThree.attr('name')).toEqual('_value[2]');
      view.$('.djblets-c-list-edit-widget__remove-item').eq(1).click();
      expect($numRows.val()).toEqual('2');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(2);
      expect(view.$('.djblets-c-list-edit-widget__remove-item').length).toEqual(2);
      $inputOne = view.$('.djblets-c-list-edit-widget__input').eq(0);
      expect($inputOne.val()).toEqual('One');
      expect($inputOne.attr('name')).toEqual('_value[0]');
      $inputTwo = view.$('.djblets-c-list-edit-widget__input').eq(1);
      expect($inputTwo.val()).toEqual('Three');
      expect($inputTwo.attr('name')).toEqual('_value[1]');
      view.$('.djblets-c-list-edit-widget__remove-item').eq(1).click();
      expect($numRows.val()).toEqual('1');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(1);
      expect(view.$('.djblets-c-list-edit-widget__remove-item').length).toEqual(1);
      $inputOne = view.$('.djblets-c-list-edit-widget__input').eq(0);
      expect($inputOne.val()).toEqual('One');
      expect($inputOne.attr('name')).toEqual('_value[0]');
      view.$('.djblets-c-list-edit-widget__remove-item').click();
      expect($numRows.val()).toEqual('1');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(1);
      $inputOne = view.$('.djblets-c-list-edit-widget__input').eq(0);
      expect($inputOne.val()).toEqual('');
      expect($inputOne.attr('name')).toEqual('_value[0]');
    });
  });
  describe('Addition', function () {
    it('With values', function () {
      const [view, $numRows] = makeView(["<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[0]\"\nvalue=\"One\" />", "<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[1]\"\nvalue=\"Two\" />", "<input type=\"text\"\nclass=\"djblets-c-list-edit-widget__input\"\nname=\"_value[2]\"\nvalue=\"Three\" />"]);
      view.$('.djblets-c-list-edit-widget__add-item').click();
      expect($numRows.val()).toEqual('4');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(4);
      let $inputOne = view.$('.djblets-c-list-edit-widget__input').eq(0);
      expect($inputOne.val()).toEqual('One');
      expect($inputOne.attr('name')).toEqual('_value[0]');
      let $inputTwo = view.$('.djblets-c-list-edit-widget__input').eq(1);
      expect($inputTwo.val()).toEqual('Two');
      expect($inputTwo.attr('name')).toEqual('_value[1]');
      let $inputThree = view.$('.djblets-c-list-edit-widget__input').eq(2);
      expect($inputThree.val()).toEqual('Three');
      expect($inputThree.attr('name')).toEqual('_value[2]');
      let $inputFour = view.$('.djblets-c-list-edit-widget__input').eq(3);
      expect($inputFour.val()).toEqual('');
      expect($inputFour.attr('name')).toEqual('_value[3]');
    });
    it('With no values', function () {
      const [view, $numRows] = makeView([]);
      view.$('.djblets-c-list-edit-widget__add-item').click();
      expect($numRows.val()).toEqual('2');
      expect(view.$('.djblets-c-list-edit-widget__entry').length).toEqual(2);
      let $inputOne = view.$('.djblets-c-list-edit-widget__input').eq(0);
      expect($inputOne.val()).toEqual('');
      expect($inputOne.attr('name')).toEqual('_value[0]');
      let $inputTwo = view.$('.djblets-c-list-edit-widget__input').eq(1);
      expect($inputTwo.val()).toEqual('');
      expect($inputTwo.attr('name')).toEqual('_value[1]');
    });
  });
});

//# sourceMappingURL=listEditViewTests.js.map