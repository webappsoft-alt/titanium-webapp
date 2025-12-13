'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { axiosInstance } from "./axiosInstance";
import { setLogout } from "../redux/loginForm";
import toast from "react-hot-toast";
import { useRef, useCallback } from 'react'; // Add these imports
import { useRouter } from "next/navigation";
import { decryptResponse } from "./decryptResponse";

const ApiFunction = () => {
    const dispatch = useDispatch();
    const { replace } = useRouter()
    // Track active requests to prevent duplicates
    const activeRequestsRef = useRef(new Map());

    const handleUserLogout = () => {
        dispatch(setLogout());
        replace("/auth/login");
        toast.info('Your session is expire, please login');
    };

    // Define headers
    const header1 = {
        "Content-Type": "application/json",
    };

    const header2 = {
        "Content-Type": "multipart/form-data",
    };

    // Helper to generate request key
    const getRequestKey = (method, endpoint, params) => {
        return `${method}:${endpoint}:${JSON.stringify(params || {})}`;
    };

    // API Functions
    const get = useCallback(async (endpoint, params, options = {}) => {
        const { deduplicate = true, signal } = options;
        const requestKey = getRequestKey('GET', endpoint, params);

        // Check for duplicate requests
        if (deduplicate && activeRequestsRef.current.has(requestKey)) {
            console.log('Preventing duplicate GET request:', requestKey);
            return activeRequestsRef.current.get(requestKey);
        }

        // Create new controller if one wasn't provided
        const controller = signal ? undefined : new AbortController();
        const requestSignal = signal || controller?.signal;

        const requestPromise = axiosInstance.get(endpoint, {
            headers: header1,
            params,
            signal: requestSignal,
        })
            .then((response) => decryptResponse(response?.data))
            .catch(error => {
                console.error("Error in GET request:", error);
                if (error?.response?.status === 401) {
                    handleUserLogout();
                }
                // Remove from active requests on error
                activeRequestsRef.current.delete(requestKey);
                throw error;
            })
            .finally(() => {
                // Remove from active requests when done
                activeRequestsRef.current.delete(requestKey);
            });

        // Store the promise if deduplicating
        if (deduplicate) {
            activeRequestsRef.current.set(requestKey, requestPromise);
        }

        return requestPromise;
    }, [dispatch]);

    const post = useCallback(async (endpoint, apiData, options = {}) => {
        const { headers = header1, deduplicate = true, signal } = options;
        const requestKey = getRequestKey('POST', endpoint, apiData);

        // Check for duplicate requests
        if (deduplicate && activeRequestsRef.current.has(requestKey)) {
            console.log('Preventing duplicate POST request:', requestKey);
            return activeRequestsRef.current.get(requestKey);
        }

        // Create new controller if one wasn't provided
        const controller = signal ? undefined : new AbortController();
        const requestSignal = signal || controller?.signal;

        const requestPromise = axiosInstance.post(endpoint, apiData, {
            headers,
            signal: requestSignal,
        })
            .then((response) => decryptResponse(response?.data))
            .catch(error => {
                console.error("Error in POST request:", error);
                if (error?.response?.status === 401) {
                    handleUserLogout();
                }
                activeRequestsRef.current.delete(requestKey);
                throw error;
            })
            .finally(() => {
                activeRequestsRef.current.delete(requestKey);
            });

        if (deduplicate) {
            activeRequestsRef.current.set(requestKey, requestPromise);
        }

        return requestPromise;
    }, [dispatch]);

    // Similar implementation for delete and put
    const deleteData = useCallback(async (endpoint, options = {}) => {
        const { headers = header1, deduplicate = true, signal } = options;
        const requestKey = getRequestKey('DELETE', endpoint);

        if (deduplicate && activeRequestsRef.current.has(requestKey)) {
            return activeRequestsRef.current.get(requestKey);
        }

        const controller = signal ? undefined : new AbortController();
        const requestSignal = signal || controller?.signal;

        const requestPromise = axiosInstance.delete(endpoint, {
            headers,
            signal: requestSignal,
        })
            .then((response) => decryptResponse(response?.data))
            .catch(error => {
                console.error("Error in DELETE request:", error);
                if (error?.response?.status === 401) {
                    handleUserLogout();
                }
                activeRequestsRef.current.delete(requestKey);
                throw error;
            })
            .finally(() => {
                activeRequestsRef.current.delete(requestKey);
            });

        if (deduplicate) {
            activeRequestsRef.current.set(requestKey, requestPromise);
        }

        return requestPromise;
    }, [dispatch]);

    const put = useCallback(async (endpoint, apiData, options = {}) => {
        const { headers = header1, deduplicate = true, signal } = options;
        const requestKey = getRequestKey('PUT', endpoint, apiData);

        if (deduplicate && activeRequestsRef.current.has(requestKey)) {
            return activeRequestsRef.current.get(requestKey);
        }

        const controller = signal ? undefined : new AbortController();
        const requestSignal = signal || controller?.signal;

        const requestPromise = axiosInstance.put(endpoint, apiData, {
            headers,
            signal: requestSignal,
        })
            .then((response) => decryptResponse(response?.data))
            .catch(error => {
                console.error("Error in PUT request:", error);
                if (error?.response?.status === 401) {
                    handleUserLogout();
                }
                activeRequestsRef.current.delete(requestKey);
                throw error;
            })
            .finally(() => {
                activeRequestsRef.current.delete(requestKey);
            });

        if (deduplicate) {
            activeRequestsRef.current.set(requestKey, requestPromise);
        }

        return requestPromise;
    }, [dispatch]);

    // Helper to cancel all active requests
    const cancelAllRequests = useCallback(() => {
        activeRequestsRef.current.forEach((promise, key) => {
            console.log('Cancelling request:', key);
            // Since we don't have direct access to the controller, we can't cancel
            // But we can flag these as inactive
            activeRequestsRef.current.delete(key);
        });
        activeRequestsRef.current.clear();
    }, []);

    return {
        get,
        post,
        deleteData,
        put,
        header1,
        header2,
        cancelAllRequests
    };
};

export default ApiFunction;