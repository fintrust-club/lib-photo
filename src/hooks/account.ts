import { useCallback, useEffect, useState } from "react";
import { FIRESTORE_DB, fb } from "../core/firebase/setup";
import {
  initilizeComplete,
  saveOnboardingUserData,
  updateFirebaseUser,
  updateUser,
} from "../store/slices/core/account";
import { useAppDispatch, useAppSelector } from "./app";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

export const useAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserExists, setUserExists] = useState(false);
  const firebaseUser = useAppSelector((state) => state.account.firebaseUser);
  const initilized = useAppSelector((state) => state.account.initilized);
  const user = useAppSelector((state) => state.account.user);
  const onboardingData = useAppSelector(
    (state) => state.account.onboardingData
  );
  const dispatch = useAppDispatch();

  const getProfile = useCallback(async (email: string) => {
    return await fb.getDocument(FIRESTORE_DB.USERS, email);
  }, []);

  const _fetchUser = async () => {
    if (!firebaseUser?.email) return;

    const profile = await getProfile(firebaseUser?.email);
    dispatch(updateUser(profile));
  };

  useEffect(() => {
    getProfile(onboardingData?.email).then((data) => {
      setUserExists(!!data);
    });
  }, [onboardingData, getProfile]);

  const _updateUser = async (user: User | null) => {
    if (user && user?.email) {
      const { displayName, email, phoneNumber, photoURL, uid } = user ?? {};

      dispatch(
        updateFirebaseUser({ displayName, email, phoneNumber, photoURL, uid })
      );
      const profile = await getProfile(user?.email);
      dispatch(updateUser(profile));
      dispatch(initilizeComplete());
      navigate(location.pathname, { replace: true });
    } else {
      dispatch(initilizeComplete());
      dispatch(updateFirebaseUser(null));
      dispatch(updateUser(null));
    }
  };

  const init = async () => {
    fb.init(_updateUser);
  };

  const signInEmail = async (email?: string, password?: string) => {
    if (!email || !password) return;

    return await fb.signInEmail(email, password);
  };

  const createAccount = async (email?: string, password?: string) => {
    if (!email || !password) return;

    return await fb.createAccount(email, password);
  };

  const signOut = async () => {
    await fb.signOut();
  };

  const updateLink = async (link: string, email?: string) => {
    const _email = email ?? firebaseUser?.email;

    if (!link || !_email) return;

    try {
      await fb.setDocument(FIRESTORE_DB.USERS, _email, {
        link,
      });
      await _fetchUser();
    } catch (err) {
      throw new Error("Could not update link");
    }
  };

  const _updateUserProfile = async (data: any) => {
    if (!firebaseUser?.email) return;

    try {
      await fb.setDocument(FIRESTORE_DB.USERS, firebaseUser?.email, data);
      await _fetchUser();
    } catch (err) {
      throw new Error("Could not update link");
    }
  };

  const updateProfile = async (fields: {
    name: string;
    instagram_id: string;
    followers_count: string;
    email: string;
    phone: string;
    based_in: string;
    content_category: string;
    reel_cost: number;
    story_cost: number;
    post_cost: number;
    currency: string;
  }) => {
    if (!fields?.email) return null;

    try {
      const {
        name,
        instagram_id,
        followers_count,
        email,
        phone,
        based_in,
        content_category,
        reel_cost,
        story_cost,
        post_cost,
        currency,
      } = fields ?? {};

      const payload = {
        name,
        instagram_id,
        followers_count,
        email,
        phone,
        based_in,
        content_category,
        currency,
        cost: {
          reel: reel_cost,
          story: story_cost,
          post: post_cost,
        },
      };

      const existingData = await fb.getDocument(FIRESTORE_DB.USERS, email);

      let warning = undefined;
      if (existingData) {
        if (existingData?.instagram_id !== instagram_id)
          warning = `You have provided another insta handle earlier (${existingData?.instagram_id}). Updating with new one (${instagram_id}).`;
      }

      await fb.setDocument(FIRESTORE_DB.USERS, email, payload);
      await _fetchUser();
      return warning;
    } catch (err: any) {
      throw new Error(err?.message ?? "Somethong went wrong!");
    }
  };

  const saveOnboardingData = async (fields: any) => {
    dispatch(saveOnboardingUserData(fields));
  };

  const validateLink = async (link: string) => {
    const result = await fb.queryKey(FIRESTORE_DB.USERS, "link", link);
    return result?.size === 0;
  };

  return {
    firebaseUser,
    user,
    init,
    signInEmail,
    signOut,
    updateProfile,
    getProfile,
    createAccount,
    initilized,

    link: {
      validate: validateLink,
      update: updateLink,
    },

    profile: {
      update: _updateUserProfile,
    },

    onboarding: {
      data: onboardingData,
      save: saveOnboardingData,
      isUserExists: isUserExists,
    },
  };
};
