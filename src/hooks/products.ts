import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./app";
import { FIRESTORE_DB, fb } from "src/core/firebase/setup";
import { setProducts } from "src/store/slices/influ/product";

type LocalProduct = {
  name: string;
  link: string;
  price: number | null;
  imagePath: string;
};

type Product = LocalProduct & {
  id: string;
  user: string;
};

export const useProducts = () => {
  const firebaseUser = useAppSelector((state) => state.account.firebaseUser);
  const products = useAppSelector((state) => state.product.products);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const _fetchProducts = async (email?: string) => {
    const _email = email ?? firebaseUser?.email;
    if (!_email) return;

    const querySnapshot = await fb.queryKey(
      FIRESTORE_DB.PRODUCTS,
      "user",
      _email
    );

    const data = querySnapshot?.docs?.map((doc) => {
      if (doc?.exists()) {
        const _data = doc?.data();
        return {
          id: doc?.id,
          ..._data,
        };
      } else return null;
    });

    dispatch(setProducts(data as Product[]));
  };

  const _save = async (_product: LocalProduct & { id?: string }) => {
    if (!firebaseUser?.email) return;

    const payload = JSON.parse(
      JSON.stringify({
        ..._product,
        user: firebaseUser?.email,
      })
    );
    try {
      setLoading(true);

      if (_product?.id) {
        await fb.setDocument(FIRESTORE_DB.PRODUCTS, _product?.id, payload);
      } else {
        await fb.addDocument(FIRESTORE_DB.PRODUCTS, payload);
      }

      await _fetchProducts();
    } catch (err) {
      throw new Error("Could not update link");
    } finally {
      setLoading(false);
    }
  };

  const _delete = async (id: string) => {
    await fb.deleteDocument(FIRESTORE_DB.PRODUCTS, id);
    await _fetchProducts();
  };

  return {
    loading,
    products,
    save: _save,
    delete: _delete,
    fetch: _fetchProducts,
  };
};
