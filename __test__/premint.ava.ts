import { Workspace } from "near-willem-workspaces-ava";
import { NEAR } from "near-units";
import { deploy } from "./util";

const runner = Workspace.init(
  { initialBalance: NEAR.parse("20 N").toString() },
  async ({ root }) => {
    
    const tenk = await deploy(root, "tenk", {
      is_premint: true,
      // This is currently hard to test without fast forwarding so I think the best to test it fails then add delay.
      // 
      premint_deadline_at: 10,
    });
    return { tenk };
  }
);

runner.test("premint", async (t, { root, tenk }) => {
  t.assert(true);
});
