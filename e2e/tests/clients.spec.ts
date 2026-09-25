import { test, expect } from '../fixtures/index';
import { mockBrregFound } from '../fixtures/brreg-mock';
import { NEW_CLIENT } from '../fixtures/test-data';
import { ClientFormPage } from '../pages/client-form.page';
import { ClientListPage } from '../pages/client-list.page';

test.describe('Client creation', () => {
  test('creates a client via organization-number lookup and it appears in the list', async ({ page, loginAs }) => {
    await loginAs('admin'); // only admins can create clients

    await mockBrregFound(page, NEW_CLIENT.orgNumber, {
      navn: NEW_CLIENT.companyName,
      adresse: NEW_CLIENT.adresse,
      postnummer: NEW_CLIENT.postnummer,
      poststed: NEW_CLIENT.poststed,
    });

    const form = new ClientFormPage(page);
    await form.gotoNew();
    await form.lookupOrgNumber(NEW_CLIENT.orgNumber);

    // Lookup should populate Name from the mocked response — no manual typing.
    await expect(form.nameInput).toHaveValue(NEW_CLIENT.companyName);
    await expect(form.lookupMessage).toHaveCount(0);

    await form.save();

    const list = new ClientListPage(page);
    await expect(page).toHaveURL(/\/clients$/);

    await list.search(NEW_CLIENT.companyName);
    await expect(list.rowByName(NEW_CLIENT.companyName)).toBeVisible();
    await expect(list.rowByName(NEW_CLIENT.companyName)).toContainText(NEW_CLIENT.orgNumber);
  });
});