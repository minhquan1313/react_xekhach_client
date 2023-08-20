import { Col, Row, RowProps } from "antd";
import { ReactNode } from "react";

interface IProps extends RowProps {
  children: ReactNode;
}

function MyContainer({ children, justify = "center", style, ...rest }: IProps) {
  return (
    <Row
      justify={justify}
      style={{ ...style, padding: "20px" }}
      {...rest}>
      <Col
        xs={{ span: 24 }}
        xl={{ span: 20 }}
        // lg={{ span: 24 }}
        xxl={{ span: 18 }}>
        {children}
      </Col>
    </Row>
  );
}

interface IRowProps extends RowProps {
  children: ReactNode;
}
function MyRow({ children, gutter, ...rest }: IRowProps) {
  return (
    <div style={{ overflow: "hidden" }}>
      <Row
        gutter={gutter || [20, 20]}
        {...rest}>
        {children}
      </Row>
    </div>
  );
}

MyContainer["Row"] = MyRow;
export default MyContainer;
