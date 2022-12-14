"use strict";

suite('rb/configForms/models/ResourceListItem', function () {
  const TestListItem = RB.Config.ResourceListItem.extend({
    syncAttrs: ['name', 'fileRegex'],
    createResource: attrs => new RB.DefaultReviewer(attrs)
  });
  let resource;
  beforeEach(function () {
    resource = new RB.DefaultReviewer({
      name: 'my-name',
      fileRegex: '.*'
    });
  });
  describe('Synchronizing attributes', function () {
    it('On resource attribute change', function () {
      const listItem = new TestListItem({
        resource: resource
      });
      resource.set('name', 'foo');
      expect(listItem.get('name')).toBe('foo');
    });
    describe('On creation', function () {
      it('With existing resource', function () {
        const listItem = new TestListItem({
          resource: resource,
          name: 'dummy',
          fileRegex: '/foo/.*'
        });
        expect(listItem.get('name')).toBe('my-name');
        expect(listItem.get('fileRegex')).toBe('.*');
      });
      it('With created resource', function () {
        const listItem = new TestListItem({
          id: 123,
          name: 'new-name',
          fileRegex: '/foo/.*'
        });
        expect(listItem.get('name')).toBe('new-name');
        expect(listItem.get('fileRegex')).toBe('/foo/.*');
        resource = listItem.get('resource');
        expect(resource.id).toBe(123);
        expect(resource.get('name')).toBe('new-name');
        expect(resource.get('fileRegex')).toBe('/foo/.*');
      });
    });
  });
  describe('Event mirroring', function () {
    let listItem;
    beforeEach(function () {
      listItem = new TestListItem({
        resource: resource
      });
      spyOn(listItem, 'trigger');
    });
    it('destroy', function () {
      resource.trigger('destroy');
      expect(listItem.trigger).toHaveBeenCalledWith('destroy', listItem, undefined, {});
    });
    it('request', function () {
      resource.trigger('request');
      expect(listItem.trigger).toHaveBeenCalledWith('request');
    });
    it('sync', function () {
      resource.trigger('sync');
      expect(listItem.trigger).toHaveBeenCalledWith('sync');
    });
  });
});

//# sourceMappingURL=resourceListItemModelTests.js.map