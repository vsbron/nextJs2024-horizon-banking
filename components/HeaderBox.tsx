/* eslint-disable no-undef */
function HeaderBox({ type = "title", title, subtext, user }: HeaderBoxProps) {
  // Returned JSX
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient">&nbsp;{user}</span>
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
}

export default HeaderBox;
