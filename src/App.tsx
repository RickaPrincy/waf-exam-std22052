import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { HumanVerification, AwsWafCaptchaHandler } from "./waf";

const App = () => {
  return (
    <BrowserRouter>
      <AwsWafCaptchaHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/human-verification" element={<HumanVerification />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
