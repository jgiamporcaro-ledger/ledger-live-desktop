import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import styled from "styled-components";
const duration = 150;
const ChildrenWrapper = styled.div`
  transition: opacity ${duration}ms ease-in-out;

  &.transition-inout-enter {
    opacity: 0;
  }

  &.transition-inout-enter-active {
    opacity: 1;
  }

  &.transition-inout-exit {
    opacity: 1;
  }

  &.transition-inout-exit-active {
    opacity: 0;
  }
`;
type TransitionInOutProps = Partial<
  CSSTransitionProps & {
    children: React.ReactNode;
    in: boolean;
    timeout?: number;
    appear?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
  }
>;

const TransitionInOut = ({
  children,
  in: inProp,
  timeout = duration,
  ...TransitionProps
}: TransitionInOutProps) => (
  <CSSTransition {...TransitionProps} in={inProp} timeout={timeout} classNames="transition-inout">
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </CSSTransition>
);

export default TransitionInOut;
