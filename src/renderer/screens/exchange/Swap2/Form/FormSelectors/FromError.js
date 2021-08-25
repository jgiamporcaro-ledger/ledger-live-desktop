// @flow
import React, { useCallback } from "react";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { Account, TokenAccount, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NotEnoughBalance, NotEnoughGas } from "@ledgerhq/errors";
import {
  SwapExchangeRateAmountTooLow,
  SwapExchangeRateAmountTooHigh,
} from "@ledgerhq/live-common/lib/errors";
import { useHistory } from "react-router-dom";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";

const ErrorBox: ThemedComponent<{}> = styled(Box).attrs(p => ({ horizontal: true, width: "100%" }))`
  color: ${props => props.theme.colors.alertRed};
  column-gap: 0.25rem;
`;

const getErrorTranslationKey = error => {
  switch (true) {
    case error instanceof NotEnoughBalance:
      return {
        i18nKey: "swap2.form.from.errors.notEnoughBalance",
      };
    case error instanceof NotEnoughGas:
      return {
        i18nKey: "swap2.form.from.errors.notEnoughGas",
      };
    case error instanceof SwapExchangeRateAmountTooLow:
      return {
        i18nKey: "swap2.form.from.errors.exchangeAmountTooLow",
      };
    case error instanceof SwapExchangeRateAmountTooHigh:
      return {
        i18nKey: "swap2.form.from.errors.exchangeAmountTooHigh",
      };
    default:
      return {
        i18nKey: "swap2.form.from.errors.default",
      };
  }
};

type BuyButtonProps = { currency: CryptoCurrency, account: Account };
const BuyButton = ({ currency, account }: BuyButtonProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(closeAllModal());
    setTrackingSource("send flow");
    history.push({
      pathname: "/exchange",
      state: {
        tab: 0,
        defaultCurrency: currency,
        defaultAccount: account,
      },
    });
  }, [account, currency, dispatch, history]);

  if (!isCurrencySupported("BUY", currency)) {
    return null;
  }

  return (
    <span role="button" onClick={onClick} style={{ display: "inline-block", cursor: "pointer" }}>
      <Text ff="Inter" fontSize="10px" lineHeight="1.4" color="palette.primary.main">
        <Trans i18nKey="buy.buyCTA" values={{ currencyTicker: currency.ticker }} />
      </Text>
    </span>
  );
};

const SwapFormError = ({ error, account }: { error: Error, account: Account | TokenAccount }) => {
  const { i18nKey } = getErrorTranslationKey(error);
  const currency = account?.currency ?? account?.token;

  return (
    <ErrorBox>
      <ExclamationCircle size={12} />
      <Text ff="Inter" fontSize="0.6875rem" lineHeight="1.4">
        <Trans
          i18nKey={i18nKey}
          components={{
            buycta: <BuyButton currency={currency} account={account} />,
            /* @DEV: Conditionnaly render the second option offered to the user 
            only if the currency is supported */
            ifsupported: isCurrencySupported("BUY", currency) ? (
              <></>
            ) : (
              <span style={{ display: "none" }} />
            ),
          }}
        />
      </Text>
    </ErrorBox>
  );
};

export default SwapFormError;
