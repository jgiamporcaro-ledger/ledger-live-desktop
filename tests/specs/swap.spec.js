// import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import initialize, {
  // page,
  // modalPage,
  app,
  mockDeviceEvent,
  deviceInfo,
  mockListAppsResult,
} from "../common.js";

describe("Swap", () => {
  initialize(
    "swap",
    {
      userData: "1AccountBTC1AccountETH",
    },
    { SPECTRON_RUN_DISABLE_COUNTDOWN_TIMERS: true },
  );

  const $ = selector => app.client.$(selector);

  it("access the feature", async () => {
    const elem = await $("#drawer-swap-button");
    await elem.click();
    await app.client.waitForSync();
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "swap-providers", // NB no longer providers but ci doesnt want a name change
    });
  });

  it("fill the form and get rates", async () => {
    const fromCurrency = await $("#swap-form-from-currency .select__control");
    await fromCurrency.click();
    const fromCurrencyInput = await $("#swap-form-from-currency .select__control input");
    await fromCurrencyInput.addValue("bitcoin");
    const fromCurrencyFirstOption = await $(".select-options-list .option:first-child");
    await fromCurrencyFirstOption.click();
    await app.client.pause(1000);

    // Fill the amount
    const amount = await $("#swap-form-from-amount");
    await amount.waitForDisplayed();
    await amount.addValue(["0.2", "Tab"]);

    const toCurrency = await $("#swap-form-to-currency .select__control");
    await toCurrency.click();
    const toCurrencyInput = await $("#swap-form-to-currency .select__control input");
    await toCurrencyInput.addValue("ethereum");
    const toCurrencyFirstOption = await $(".select-options-list .option:first-child");
    await toCurrencyFirstOption.click();
    const floatMethod = await $("#swap-form-tradeMethod-float");
    await floatMethod.click();
    await app.client.pause(2000);
    const continueButton = await $("#swap-form-continue-button");
    await continueButton.waitForEnabled();

    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "swap-rates",
    });
  });

  it("confirm summary step", async () => {
    // Open the modal
    const continueButton = await $("#swap-form-continue-button");
    await continueButton.waitForEnabled();
    await continueButton.click();

    const summaryProviderCheckbox = await $("#swap-modal-summary-provider-tos-checkbox");
    await summaryProviderCheckbox.waitForDisplayed();
    await summaryProviderCheckbox.click();

    expect(await app.client.screenshot(1000)).toMatchImageSnapshot({
      customSnapshotIdentifier: "swap-summary-step",
    });
  });

  // it("confirm swap on device and broadcast step", async () => {
  //   const summaryContinueButton = await $("#swap-modal-summary-continue-button");
  //   await summaryContinueButton.waitForEnabled();
  //   await summaryContinueButton.click();

  //   await mockDeviceEvent({ type: "opened" }, { type: "complete" });
  //   // init-swap command (Extra pauses because otherwise the UI will not be visible)
  //   await mockDeviceEvent({ type: "opened" });
  //   await mockDeviceEvent({ type: "init-swap-requested" });
  //   await app.client.pause(2000);
  //   const confirmationStep = await $("#swap-modal-device-confirm");
  //   await confirmationStep.waitForDisplayed();
  //   await app.client.pause(1000);
  //   await mockDeviceEvent(
  //     {
  //       type: "init-swap-result",
  //       initSwapResult: {
  //         transaction: fromTransactionRaw({
  //           family: "bitcoin",
  //           recipient: "1Cz2ZXb6Y6AacXJTpo4RBjQMLEmscuxD8e",
  //           amount: "1",
  //           feePerByte: "1",
  //           networkInfo: {
  //             family: "bitcoin",
  //             feeItems: {
  //               items: [
  //                 { key: "0", speed: "high", feePerByte: "3" },
  //                 { key: "1", speed: "standard", feePerByte: "2" },
  //                 { key: "2", speed: "low", feePerByte: "1" },
  //               ],
  //               defaultFeePerByte: "1",
  //             },
  //           },
  //           rbf: false,
  //           utxoStrategy: {
  //             strategy: 0,
  //             pickUnconfirmedRBF: false,
  //             excludeUTXOs: [],
  //           },
  //         }),
  //         swapId: "12345",
  //       },
  //     },
  //     { type: "complete" },
  //   );

  //   // Silent signing, then automatic broadcasting triggered.
  //   await mockDeviceEvent({ type: "opened" }, { type: "complete" });
  //   await app.client.pause(5000); // Signing step takes time

  //   const finishedStep = await $("#swap-modal-finished-close-button");
  //   await finishedStep.waitForDisplayed();
  //   await app.client.pause(1000);
  //   expect(await app.client.screenshot()).toMatchImageSnapshot({
  //     customSnapshotIdentifier: "swap-end-0",
  //   });
  // });

  // it("should appear in the history", async () => {
  //   const finishedStep = await $("#swap-modal-finished-close-button");
  //   await finishedStep.waitForDisplayed();
  //   await finishedStep.click();
  //   await finishedStep.waitForDisplayed({ reverse: true });

  //   expect(await app.client.screenshot()).toMatchImageSnapshot({
  //     customSnapshotIdentifier: "swap-end-1",
  //   });
  // });

  // it("should show operation details modal", async () => {
  //   const firstRow = await $(".swap-history-row:first-child");
  //   await firstRow.waitForDisplayed();
  //   await firstRow.click();
  //   await modalPage.waitForDisplayed();

  //   expect(await app.client.screenshot()).toMatchImageSnapshot({
  //     customSnapshotIdentifier: "swap-history-modal",
  //   });
  // });
});
