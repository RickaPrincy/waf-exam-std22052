import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { HumanVerification, useAwsWafCaptchaHandler } from "./waf";

const App = () => {
  useAwsWafCaptchaHandler();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/human-verification" element={<HumanVerification />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
