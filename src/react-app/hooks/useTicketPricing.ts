import { useEffect, useMemo } from 'react';
import type { Service, ServiceCategory, ServiceFormat, ServiceFormatSetting } from '../types';
import { SERVICE_FORMATS } from '../types';
import { useServices } from './useServices';
import { useServiceFormats } from './useServiceFormats';

const SERVICE_TYPE_TO_CATEGORY: Record<string, ServiceCategory | null> = {
  repair: 'repair',
  setup: 'setup',
  recovery: 'recovery',
  consultation: 'consultation',
  installation: 'setup',
  'virus-removal': 'recovery',
};

const pickServicePrice = (service: Service | null | undefined): number | null => {
  if (!service) {
    return null;
  }

  if (typeof service.price === 'number' && service.price > 0) {
    return service.price;
  }
  if (typeof service.minPrice === 'number' && service.minPrice > 0) {
    return service.minPrice;
  }
  if (typeof service.maxPrice === 'number' && service.maxPrice > 0) {
    return service.maxPrice;
  }

  return null;
};

const pickCategoryPrice = (services: Service[], category: ServiceCategory | null): number | null => {
  if (!category) {
    return null;
  }

  const candidates = services
    .filter(service => service.category === category)
    .map(service => pickServicePrice(service))
    .filter((value): value is number => value !== null);

  if (!candidates.length) {
    return null;
  }

  return Math.min(...candidates);
};

const pickBasePrice = (services: Service[], serviceType: string): number | null => {
  if (!serviceType) {
    return null;
  }

  const service = services.find(item => item.id === serviceType);
  const servicePrice = pickServicePrice(service);
  if (servicePrice !== null) {
    return servicePrice;
  }

  // Fallback to legacy category-based values to support old links/forms
  return pickCategoryPrice(services, SERVICE_TYPE_TO_CATEGORY[serviceType] ?? null);
};

const getFallbackFormats = (): ServiceFormatSetting[] =>
  SERVICE_FORMATS.map(format => ({ format, surcharge: format === 'on-site' ? 2000 : 0 }));

export function useTicketPricing(serviceType: string, serviceFormat: ServiceFormat) {
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    loadServices,
  } = useServices();
  const {
    formats,
    loading: formatsLoading,
    error: formatsError,
    loadFormats,
  } = useServiceFormats();

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    loadFormats();
  }, [loadFormats]);

  const formatOptions = formats.length ? formats : getFallbackFormats();
  const basePrice = useMemo(() => pickBasePrice(services, serviceType), [services, serviceType]);
  const formatSurcharge = useMemo(() => {
    const found = formatOptions.find(option => option.format === serviceFormat);
    return found ? found.surcharge : 0;
  }, [formatOptions, serviceFormat]);

  const finalPrice = basePrice !== null ? basePrice + formatSurcharge : null;

  return {
    basePrice,
    formatSurcharge,
    finalPrice,
    formatOptions,
    loading: servicesLoading || formatsLoading,
    error: servicesError ?? formatsError,
  };
}
