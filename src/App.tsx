import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AwsWafCaptchaHandler, HumanVerification } from "./waf";

const App = () => {
  return (
    <>
      <AwsWafCaptchaHandler />
      <BrowserRouter>
        <Routes>
          <Route path="/human-verification" element={<HumanVerification />} />
          <Route path="/" element={<div>Home , Welcome</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
