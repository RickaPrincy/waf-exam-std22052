import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { v4 as uuid } from "uuid";
import { isAxiosError } from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";

import { getAxiosInstance } from "../conf/axios";
import { JCLOUDIFY_URL } from "../conf/api";

const WafFormSchema = z.object({
  N: z
    .number()
    .min(1, "Le nombre doit être au moins 1.")
    .max(1000, "Le nombre doit être au plus 1 000.")
});
type WafFormType = z.infer<typeof WafFormSchema>;

const CURRENT_VALUE_SEARCH_CACHE_NAME = "current_value";
const MAX_VALUE_SEARCH_CACHE_NAME = "max_value";
export const Home = () => {
  const [countConf, setCountConf] = useState<{ maxCount: number, isDoingSequence: boolean, current: number }>({
    current: +(localStorage.getItem(CURRENT_VALUE_SEARCH_CACHE_NAME) ?? 0),
    isDoingSequence:
      localStorage.getItem(MAX_VALUE_SEARCH_CACHE_NAME) !== undefined && localStorage.getItem(MAX_VALUE_SEARCH_CACHE_NAME) !== "0"
    ,
    maxCount: +(localStorage.getItem(MAX_VALUE_SEARCH_CACHE_NAME) ?? 0),
  });

  const callWhoami = async () => {
    if (!countConf.isDoingSequence) {
      return;
    }

    try {
      await getAxiosInstance().get(`${JCLOUDIFY_URL}/whoami`);
    } catch (error) {
      if (isAxiosError(error) && error.status === 403) {
        setCountConf(prev => ({
          ...prev,
          current: prev.current + 1
        }));
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      callWhoami();
    }, 1_000);

    return () => {
      clearInterval(timer);
    }
  }, [countConf.isDoingSequence, countConf.current]);

  useEffect(() => {
    localStorage.setItem(CURRENT_VALUE_SEARCH_CACHE_NAME, countConf.current.toString());
    localStorage.setItem(MAX_VALUE_SEARCH_CACHE_NAME, countConf.maxCount.toString());
  }, [countConf.current, countConf.maxCount])

  const { register, handleSubmit, formState: { errors } } = useForm<WafFormType>({
    defaultValues: {
      N: 1
    },
    resolver: zodResolver(WafFormSchema)
  });

  const doSequence = (data: WafFormType) => {
    setCountConf({
      current: 0,
      isDoingSequence: true,
      maxCount: +data.N,
    });
  }

  useEffect(() => {
    if (countConf.current >= countConf.maxCount) {
      localStorage.clear();
      setCountConf({
        current: 0,
        maxCount: 1,
        isDoingSequence: false
      })
    }
  }, [countConf.current, countConf.maxCount]);

  const logs = Array(countConf.current).fill(0);
  return (
    <Box sx={{ mx: "auto", width: "fit-content" }}>
      {countConf.isDoingSequence && (
        <Typography sx={{ textAlign: "center", fontSize: "1rem", opacity: .8, fontWeight: "bold", mt: 5, mb: 2 }}>
          Max Count: {countConf.maxCount}
          <br />
          Current Count: {countConf.current}
        </Typography>
      )}
      <Typography sx={{ textAlign: "center", fontSize: "1rem", opacity: .8, fontWeight: "bold", mt: 5, mb: 2 }}>
        Waf Exam STD22052
      </Typography>
      {!countConf.isDoingSequence && (
        <form onSubmit={handleSubmit(doSequence)}>
          <TextField type="number" placeholder="N Value" {...register('N', { valueAsNumber: true })} />
          <Button variant="contained" sx={{ display: "block", my: 1 }} type="submit">Submit</Button>
          <Typography sx={{ color: "red" }}>
            {errors.N?.message}
          </Typography>
        </form>
      )}
      {logs.map((_, index) => (
        <li key={uuid()}>{index + 1} Forbidden</li>
      ))}
    </Box>
  )
}
