export const ShippingConditions = {
  minWeight: 0,
  maxWeight: 0,
  minOrder: 0,
  maxOrder: 0
};

export const ShippingMethod = {
  id: '',
  name: '',
  description: '',
  baseRate: 0,
  conditions: {},
  restrictions: []
};

export const ShippingZone = {
  id: '',
  name: '',
  countries: [],
  regions: [],
  methods: []
};

export const ZoneRate = {
  zoneId: '',
  methodId: '',
  rate: 0,
  conditions: {}
};