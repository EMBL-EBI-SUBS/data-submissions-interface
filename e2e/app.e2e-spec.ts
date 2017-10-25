import { DataSubmissionsInterfacePage } from './app.po';

describe('data-submissions-interface App', function() {
  let page: DataSubmissionsInterfacePage;

  beforeEach(() => {
    page = new DataSubmissionsInterfacePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
