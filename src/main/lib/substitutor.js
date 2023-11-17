const ENV_VARS = ['ET_COS_URL', 'CCD_DEF_URL', 'CCD_DEF'];

class Substitutor {
  static injectEnvironmentVariables(value) {
    Object.keys(process.env)
      .filter(environmentVariableName => ENV_VARS.find(element => {
        if (environmentVariableName.startsWith(element)) {
          return true;
        }
      }))
      .forEach(environmentVariableName => {
        const environmentVariableValue = process.env[environmentVariableName];
        value = value.replace(new RegExp('\\$\\{' + environmentVariableName + '\\}', 'g'), environmentVariableValue);
      });
    return value;
  }
}

module.exports = { Substitutor };
