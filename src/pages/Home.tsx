import { Box, Button, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useState } from "react";
import { v4 as uuid } from "uuid";

const WafFormSchema = z.object({
  N: z.string()
});

type WafFormType = z.infer<typeof WafFormSchema>;
export const Home = () => {
  const [countConf, setCountConf] = useState<{ maxCount: number, isDoingSequence: boolean, current: number }>({
    current: 0,
    isDoingSequence: false,
    maxCount: 0
  });

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
      maxCount: +data.N
    });
  }

  const logs = Array(countConf.maxCount).fill(0);

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
