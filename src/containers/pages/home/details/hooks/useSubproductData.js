import { useState, useEffect } from "react";
import ProductDataService from "../../../../../services/products";
import { getMediaUrl } from "../utils/mediaUtils";

const useSubproductData = (subproductId) => {
  const [subproductData, setSubproductData] = useState(null);
  const [services, setServices] = useState([]);
  const [subCombos, setCombos] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubproductData = async () => {
      if (!subproductId) return;

      setIsLoading(true);
      try {
        const response = await ProductDataService.getSubProductByEmail(subproductId);
        const { subproduct, services, combos, team_members, coupons, business_hours } = response.data;

        const updatedSubproduct = {
          ...subproduct,
          logo: subproduct.logo ? getMediaUrl(subproduct.logo) : null,
          file: subproduct.file ? getMediaUrl(subproduct.file) : null,
        };
        const updatedCoupons = coupons.map((coupon) => ({
          ...coupon,
          image: coupon.image ? getMediaUrl(coupon.image) : getMediaUrl(null),
        }));
        const updatedTeamMembers = team_members.map((member) => ({
          ...member,
          photo: member.photo ? getMediaUrl(member.photo) : getMediaUrl(null),
        }));

        setSubproductData(updatedSubproduct);
        setServices(services || []);
        setCombos(combos || []);
        setTeamMembers(updatedTeamMembers || []);
        setCoupons(updatedCoupons || []);
        setBusinessHours(business_hours || []);
      } catch (error) {
        console.error("Error fetching subproduct data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubproductData();
  }, [subproductId]);

  return {
    subproductData,
    services,
    subCombos,
    teamMembers,
    coupons,
    businessHours,
    isLoading,
  };
};

export default useSubproductData;
