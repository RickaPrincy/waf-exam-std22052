import { Box, Button, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { getAxiosInstance } from "../conf/axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const WafFormSchema = z.object({
  N: z.string()
});

type WafFormType = z.infer<typeof WafFormSchema>;
const JCLOUDIFY_URL = "https://api.prod.jcloudify.com/whoami";
export const Home = () => {
  const navigate = useNavigate();
  const [countConf, setCountConf] = useState<{ timer: NodeJS.Timeout | null, maxCount: number, isDoingSequence: boolean, current: number }>({
    current: 0,
    isDoingSequence: false,
    maxCount: 0,
    timer: null
  });

  const { register, handleSubmit } = useForm<WafFormType>({
    defaultValues: {
      N: "1"
    },
    resolver: zodResolver(WafFormSchema)
  });

  const doSequence = (data: WafFormType) => {
    const timer = setInterval(async () => {
      whoami();
    }, 1_000);

    setCountConf({
      current: 0,
      isDoingSequence: true,
      maxCount: +data.N,
      timer
    });
  }

  const whoami = async () => {
    try {
      await getAxiosInstance().get(JCLOUDIFY_URL);
      throw new Error("Expected error");
    } catch (error) {
      if ((error as AxiosError).status === 405) {
        navigate(`/human-verification?current=${countConf.current}&max=${countConf.maxCount}`);
        return;
      }

      setCountConf(prev => ({
        ...prev,
        current: prev.current + 1
      }));
    }
  }

  useEffect(() => {
    if (countConf.current >= countConf.maxCount) {
      clearInterval(countConf.timer!);
      setCountConf({
        current: 0,
        timer: null,
        maxCount: 1,
        isDoingSequence: false
      })
    }
  }, [countConf.current, countConf.maxCount]);

  const logs = Array(countConf.current).fill(0);
  return (
    <Box sx={{ mx: "auto", width: "fit-content" }}>
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
