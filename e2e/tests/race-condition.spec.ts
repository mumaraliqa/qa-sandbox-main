import { test, expect } from '../fixtures/index';
import { mockBrregFound } from '../fixtures/brreg-mock';
import { RACE_CONDITION } from '../fixtures/test-data';
import { ClientFormPage } from '../pages/client-form.page';

test.describe('Organization-number lookup race condition (BUGS.md)', () => {
  test('a slow, earlier lookup silently overwrites a faster, later one', async ({ page, loginAs }) => {
    await loginAs('admin');

    // SLOW resolves after an artificial 800ms delay; FAST resolves
    // immediately. A correct implementation (switchMap) cancels the first
    // request's subscription the moment a second lookup is triggered, so
    // the form should end up showing RACE_CONDITION.fast's company
    // regardless of response timing. The app uses mergeMap, which never
    // cancels prior inner subscriptions — both requests run to completion,
    // and whichever *response* arrives last wins, not whichever was
    // *requested* last.
    await mockBrregFound(
      page,
      RACE_CONDITION.slow.orgNumber,
      {
        navn: RACE_CONDITION.slow.companyName,
        adresse: RACE_CONDITION.slow.adresse,
        postnummer: RACE_CONDITION.slow.postnummer,
        poststed: RACE_CONDITION.slow.poststed,
      },
      800,
    );
    await mockBrregFound(
      page,
      RACE_CONDITION.fast.orgNumber,
      {
        navn: RACE_CONDITION.fast.companyName,
        adresse: RACE_CONDITION.fast.adresse,
        postnummer: RACE_CONDITION.fast.postnummer,
        poststed: RACE_CONDITION.fast.poststed,
      },
      0,
    );

    const form = new ClientFormPage(page);
    await form.gotoNew();

    // Trigger the slow lookup first...
    await form.orgNumberInput.fill(RACE_CONDITION.slow.orgNumber);
    await form.lookupButton.click();

    // ...then, before it can resolve, trigger the fast one.
    await form.orgNumberInput.fill(RACE_CONDITION.fast.orgNumber);
    await form.lookupButton.click();

    // expect() polls until the slow response's artificial delay has
    // elapsed (timeout comfortably exceeds it) — no fixed sleep needed.
    // This is the bug: the form ends up showing the STALE, first-triggered
    // lookup's data, not the one the user actually asked for last.
    await expect(form.nameInput).toHaveValue(RACE_CONDITION.slow.companyName, { timeout: 2000 });
  });
});