import { FIRESTORE_DB, fb } from "src/core/firebase/setup";
import { useAccount } from "./account";
import { useState } from "react";

type Link = {
  email: string;
  id: string;
  label: string;
  link: string;
  icon_type: string;
};

export const useInfLink = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const account = useAccount();

  console.log(">>>>", account);

  const fetchLinks = async (email?: string) => {
    const _email = email ?? account?.firebaseUser?.email;
    if (!_email) return;

    try {
      const querySnapshot = await fb.queryKey(
        FIRESTORE_DB.LINKS,
        "email",
        _email
      );

      const data = querySnapshot?.docs?.map((doc) => {
        if (doc?.exists())
          return {
            id: doc?.id,
            ...doc?.data(),
          };
        else return null;
      });
      setLinks(data as Link[]);
    } catch (err) {
      return [];
    }
  };

  const save = async (
    {
      id,
      label,
      value,
      icon_type,
    }: { id?: string; label: string; value: string; icon_type: string },
    update = false
  ) => {
    if (!account?.firebaseUser?.email) return;

    const payload = {
      label,
      link: value,
      email: account?.firebaseUser?.email,
      icon_type,
    };

    if (update && id) {
      await fb.setDocument(FIRESTORE_DB.LINKS, id, payload);
    } else {
      await fb.addDocument(FIRESTORE_DB.LINKS, payload);
    }
    await fetchLinks();
  };

  const deleteLink = async (id?: string) => {
    if (!id) return;

    await fb.deleteDocument(FIRESTORE_DB.LINKS, id);
    await fetchLinks();
  };

  return {
    save,
    delete: deleteLink,
    links,
    fetch: fetchLinks,
  };
};
