import { useState, useCallback, useMemo } from "react";

const useQuantities = (services, subCombos) => {
  const [quantities, setQuantities] = useState({});
  const [comboQuantities, setComboQuantities] = useState({});

  const calculateSubtotal = useCallback(
    (price, serviceId) => (quantities[serviceId] || 0) * price,
    [quantities]
  );

  const calculateTotal = useCallback(
    () =>
      services.reduce(
        (total, service) => total + calculateSubtotal(service.price, service.id),
        0
      ),
    [services, calculateSubtotal]
  );

  const calculateComboSubtotal = useCallback(
    (combo) => (comboQuantities[combo.id] || 0) * combo.price,
    [comboQuantities]
  );

  const calculateTotalCombos = useCallback(
    () =>
      subCombos.reduce(
        (total, combo) => total + calculateComboSubtotal(combo),
        0
      ),
    [subCombos, calculateComboSubtotal]
  );

  return {
    quantities,
    setQuantities,
    comboQuantities,
    setComboQuantities,
    calculateSubtotal,
    calculateTotal,
    calculateComboSubtotal,
    calculateTotalCombos,
  };
};

export default useQuantities;
