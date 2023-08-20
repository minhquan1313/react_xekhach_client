import { Button, ButtonProps } from "antd";
import { Link, useNavigate } from "react-router-dom";

interface IProps extends ButtonProps {
  to?: string;
  loading?: boolean;
  display?: "inline";
}
function MyButton({
  to = "",
  type = "default",
  onClick,

  children,
  ...rest
}: IProps) {
  const nav = useNavigate();

  return (
    <Button
      type={type}
      style={{
        position: "relative",
      }}
      onClick={(e) => {
        onClick && onClick(e);
        to &&
          nav({
            pathname: to,
          });
      }}
      {...rest}>
      {children ||
        (to && (
          <>
            {to && (
              <Link
                to={to}
                style={{ position: "absolute", inset: 0, opacity: 0 }}>
                {children}
              </Link>
            )}
          </>
        ))}
    </Button>
    // <button
    //   className={classNames(
    //     "relative overflow-hidden rounded-full transition disabled:bg-slate-300 disabled:text-slate-500",
    //     { "bg-primary-500": display == undefined }
    //   )}
    //   type={type}
    //   onClick={onClick}
    //   disabled={disabled || loading}
    //   {...rest}>
    //   {/* loading */}
    //   <div
    //     className={classNames(
    //       "pointer-events-none absolute inset-0 z-10 flex transition ",
    //       { "translate-y-0": loading, "translate-y-full": !loading }
    //     )}>
    //     <div
    //       className={classNames(
    //         "border-warn-500 mx-auto my-auto aspect-square h-1/2 rounded-full border border-t-transparent",
    //         { "animate-spin ": loading }
    //       )}></div>
    //   </div>

    //   {/* Child */}
    //   <Element
    //     to={to}
    //     className={classNames("block text-sm transition", {
    //       "h-full w-full px-4 py-1": display == "",
    //       "-translate-y-full": loading,
    //       "text-slate-50": display == "",
    //     })}>
    //     {children}
    //   </Element>
    // </button>
  );
}

export default MyButton;
