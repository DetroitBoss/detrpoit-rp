import { system } from "./system";

let errorLogWitten = false;
process.on('warning', (warning) => {
    console.warn(warning.name);    // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack);   // Print the stack trace

    if (errorLogWitten) return;
    errorLogWitten = true;
    setTimeout(() => {
        errorLogWitten = false;
    }, 2000)
    let text = `
  !!! warning !!!
  ${warning.name}
  --------
  ${warning.message}
  ${warning.stack}
  --------
  LAST DEBUG
  ${JSON.stringify(system.lastMessageLog)}
  --------



  `;
    system.debug.warn('warning')
    system.saveLogText('warningLog', text);
});

process.on('uncaughtException', function (err) {
    if (errorLogWitten) return;
    errorLogWitten = true;
    setTimeout(() => {
        errorLogWitten = false;
    }, 2000)
    let text = `
  !!! uncaughtException !!!
  ${err.name}
  --------
  ${err.message}
  --------
  LAST DEBUG
  ${JSON.stringify(system.lastMessageLog)}
  --------



  `;
    system.debug.error('uncaughtException')
    console.error(err);
    system.saveLogText('errorLog', text);
});

process.on('unhandledRejection', (reason, promise) => {
    if (errorLogWitten) return;
    errorLogWitten = true;
    setTimeout(() => {
        errorLogWitten = false;
    }, 2000)
    let text = `
  !!! unhandledRejection !!!
  reason
  ${JSON.stringify(reason)}
  promise
  ${JSON.stringify(promise)}
  --------
  LAST DEBUG
  ${JSON.stringify(system.lastMessageLog)}
  --------


  `;
    system.debug.error('unhandledRejection')
  console.error(reason);
    system.saveLogText('errorLog', text);
})