/**
 * Centralized fake data for organization-number lookup tests. Keeping this
 * out of the spec files means no two tests can accidentally reuse the same
 * org number for two different fictional companies (which happened before
 * this file existed — clients.spec.ts and race-condition.spec.ts both used
 * '900000006'), and any test needing this data has one place to look.
 *
 * Each org number below is a fresh, syntactically-valid (mod-11 checksum)
 * Norwegian organization number that does not appear in seed.ts — chosen
 * deliberately so these tests never collide with real seeded clients.
 */

export const NEW_CLIENT = {
  orgNumber: '900000006',
  companyName: 'PLAYWRIGHT TESTFIRMA AS',
  adresse: ['Testveien 1'],
  postnummer: '0150',
  poststed: 'OSLO',
};

export const RACE_CONDITION = {
  slow: {
    orgNumber: '910000004',
    companyName: 'SLOW LOOKUP AS',
    adresse: ['Treg vei 1'],
    postnummer: '0150',
    poststed: 'OSLO',
  },
  fast: {
    orgNumber: '920000002',
    companyName: 'FAST LOOKUP AS',
    adresse: ['Rask vei 2'],
    postnummer: '0151',
    poststed: 'OSLO',
  },
};