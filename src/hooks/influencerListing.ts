import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FIRESTORE_DB, fb } from "src/core/firebase/setup";

export const useInfluListing = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [influ, setInflu] = useState<any>(null);
  const [listing, setListing] = useState([]);

  const getInfluProfile = async (linkKey: string) => {
    setLoading(true);
    const querySnapShot = await fb.queryKey(
      FIRESTORE_DB.USERS,
      "link",
      linkKey
    );

    const doc = querySnapShot?.docs?.[0];
    if (doc?.exists()) {
      setInflu(doc?.data());
    } else {
      setInflu(null);
    }
    setLoading(false);
  };

  const _getData = async () => {
    const linkKey = location.pathname?.replace("/", "");
    //TODO: fetch data by linkKey
    getInfluProfile(linkKey);
    setListing([]);
  };

  useEffect(() => {
    _getData();
  }, [location.pathname]);

  return {
    listing,
    influ,
    loading,
  };
};
