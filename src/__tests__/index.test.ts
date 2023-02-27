import TransakSDK from "../"
import { IConfigBasic } from "../interfaces"
jest.mock("../")
it("should render TransakSDK", () => {
  TransakSDK({
    apiKey: "",
    environment: "DEVELOPMENT" as IConfigBasic["environment"],
  })
})
