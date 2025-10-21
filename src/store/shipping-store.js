import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useShippingStore = create()(
  persist(
    (set, get) => ({
      zones: [],
      addZone: (zone) =>
        set((state) => ({
          zones: [...state.zones, zone],
        })),
      updateZone: (id, updates) =>
        set((state) => ({
          zones: state.zones.map((z) =>
            z.id === id ? { ...z, ...updates } : z
          ),
        })),
      deleteZone: (id) =>
        set((state) => ({
          zones: state.zones.filter((z) => z.id !== id),
        })),
      addMethod: (zoneId, method) =>
        set((state) => ({
          zones: state.zones.map((z) =>
            z.id === zoneId
              ? { ...z, methods: [...z.methods, method] }
              : z
          ),
        })),
      updateMethod: (zoneId, methodId, updates) =>
        set((state) => ({
          zones: state.zones.map((z) =>
            z.id === zoneId
              ? {
                  ...z,
                  methods: z.methods.map((m) =>
                    m.id === methodId ? { ...m, ...updates } : m
                  ),
                }
              : z
          ),
        })),
      deleteMethod: (zoneId, methodId) =>
        set((state) => ({
          zones: state.zones.map((z) =>
            z.id === zoneId
              ? {
                  ...z,
                  methods: z.methods.filter((m) => m.id !== methodId),
                }
              : z
          ),
        })),
      setZoneRate: (rate) =>
        set((state) => {
          const zone = state.zones.find((z) => z.id === rate.zoneId);
          if (!zone) return state;

          return {
            zones: state.zones.map((z) =>
              z.id === rate.zoneId
                ? {
                    ...z,
                    methods: z.methods.map((m) =>
                      m.id === rate.methodId
                        ? { ...m, baseRate: rate.rate, conditions: rate.conditions }
                        : m
                    ),
                  }
                : z
            ),
          };
        }),
      getZoneRates: (zoneId) => {
        const zone = get().zones.find((z) => z.id === zoneId);
        if (!zone) return [];

        return zone.methods.map((method) => ({
          zoneId,
          methodId: method.id,
          rate: method.baseRate,
          conditions: method.conditions,
        }));
      },
      getShippingMethods: (zoneId) => {
        const zone = get().zones.find((z) => z.id === zoneId);
        return zone?.methods || [];
      },
    }),
    {
      name: 'shipping-storage',
    }
  )
);