import { Box, Button, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { getAxiosInstance } from "../conf/axios";
import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const WafFormSchema = z.object({
  N: z.string()
});

type WafFormType = z.infer<typeof WafFormSchema>;
const JCLOUDIFY_URL = "https://api.prod.jcloudify.com/whoami";
export const Home = () => {
  const [p] = useSearchParams();
  const navigate = useNavigate();
  const [countConf, setCountConf] = useState<{ maxCount: number, isDoingSequence: boolean, current: number }>({
    current: +(p.get("current") ?? 0),
    isDoingSequence: p.get("current") !== null,
    maxCount: +(p.get("maxCount") ?? 1),
  });


  const whoami = async () => {
    if (!countConf.isDoingSequence) {
      return;
    }

    try {
      await getAxiosInstance().get(JCLOUDIFY_URL);
      throw new Error("Expected error");
    } catch (error) {
      if ((error as AxiosError).status === 405) {
        navigate(`/human-verification?current=${countConf.current}&maxCount=${countConf.maxCount}`);
        return;
      }
      setCountConf(prev => ({
        ...prev,
        current: prev.current + 1
      }));
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      whoami();
    }, 1_000);

    return () => {
      clearInterval(timer);
    }
  }, [countConf.isDoingSequence, countConf.current]);

  const { register, handleSubmit } = useForm<WafFormType>({
    defaultValues: {
      N: "1"
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
          <TextField type="number" placeholder="N Value" {...register('N')} />
          <Button variant="contained" sx={{ display: "block", my: 1 }} type="submit">Submit</Button>
        </form>
      )}
      {logs.map((_, index) => (
        <li key={uuid()}>{index + 1} Forbidden</li>
      ))}
    </Box>
  )
}
