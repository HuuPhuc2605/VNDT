import { memo } from "react";
function Content() {
  console.log("re-render");
  return (
    <div>
      <h2>Tu hoc lap trinh</h2>
    </div>
  );
}
export default memo(Content);
