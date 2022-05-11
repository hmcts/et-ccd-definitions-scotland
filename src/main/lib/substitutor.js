const ET_COS_URL = 'ET_COS_URL';
const CCD_DEF_URL = 'CCD_DEF_URL';

class Substitutor {
  static injectEnvironmentVariables (value) {
    Object.keys(process.env)
      .filter(environmentVariableName => environmentVariableName.startsWith(ET_COS_URL) ||
          environmentVariableName.startsWith(CCD_DEF_URL))
      .forEach(environmentVariableName => {
        const environmentVariableValue = process.env[environmentVariableName];
        value = value.replace(new RegExp('\\$\\{' + environmentVariableName + '\\}', 'g'), environmentVariableValue);
      });
    return value;
  }
}

module.exports = { Substitutor };
