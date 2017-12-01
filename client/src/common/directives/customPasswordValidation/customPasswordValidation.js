import angular from 'angular';

const customPasswordValidationDirective = angular.module('customPasswordValidation.js', []);

customPasswordValidationDirective.directive('customPasswordValidation', function() {
  const UPPERCASE_CHAR_REGEX = /^(?=.*[A-Z])[0-9a-zA-Z~`!@#$%^&*()_+=-{}\[\]|\\"':;?/.,><]{8,}$/;
  const LOWERCASE_CHAR_REGEX = /^(?=.*[a-z])[0-9a-zA-Z~`!@#$%^&*()_+=-{}\[\]|\\"':;?/.,><]{8,}$/;
  const INTEGER_CHAR_REGEX = /^(?=.*\d)[0-9a-zA-Z~`!@#$%^&*()_+=-{}\[\]|\\"':;?/.,><]{8,}$/;
  // const SPECIAL_CHAR_REGEX = /^(?=.*(~|`|!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\-|\{|\}|'|:|;|\?|\/|\.|,|>|<))[0-9a-zA-Z~`!@#$%^&*()_+=-{}\[\]|\\"':;?/.,><]{8,}$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the password validator
      ctrl.$validators.uppercaseChar = function(modelValue) {
        return UPPERCASE_CHAR_REGEX.test(modelValue);
      };
      ctrl.$validators.lowercaseChar = function(modelValue) {
        return LOWERCASE_CHAR_REGEX.test(modelValue);
      };
      ctrl.$validators.integerChar = function(modelValue) {
        return INTEGER_CHAR_REGEX.test(modelValue);
      };
      // ctrl.$validators.specialChar = function(modelValue) {
      //   return SPECIAL_CHAR_REGEX.test(modelValue);
      // };
    }
  };
});

export default customPasswordValidationDirective;
