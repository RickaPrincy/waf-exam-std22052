import { useEffect } from "react";
import {
  AWS_WAF_TOKEN_HEADER_KEY,
  awsWafToken,
  loadAwsWafScript,
} from "../waf";
import { getAxiosInstance } from "../conf/axios";

export const useAwsWafCaptchaHandler = () => {
  useEffect(() => {
    const axios = getAxiosInstance();
    let reqInterceptor: number;

    const setupAxiosInterceptors = async () => {
      await loadAwsWafScript();
      reqInterceptor = axios.interceptors.request.use(
        async (config) => {
          config.headers[AWS_WAF_TOKEN_HEADER_KEY] = await awsWafToken();
          return config;
        },
        (err) => Promise.reject(err)
      );
    };

    setupAxiosInterceptors();
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, []);
};
