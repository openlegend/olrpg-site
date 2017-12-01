/*
 * Simple wrapper for moment.js's fromNow() function, basically. Put in
 * milliseconds from epoch, get a readable string like "3 hours ago".
 *
 * Just as with moment.js's fromNow(), you may pass a Boolean 'noSuffix'
 * which if true will return a string without the suffix.
 *
 * {{ 12345 | fromNow }}      => "4 years ago"
 * {{ 12345 | fromNow:true }} => "4 years"
 *
 * See http://momentjs.com/docs/#/displaying/fromnow/
 */
import angular from 'angular';
import moment from 'moment';

function filter() {
  return (milliseconds, noSuffix, format) => {
    noSuffix = (noSuffix) ? noSuffix : false;
    return (format) ? moment(milliseconds).format(format) : moment(milliseconds).fromNow(noSuffix);
  };
}

const fromNowModule = angular.module('fromNow.filter.js', [])
  .filter('fromNow', filter);

export default fromNowModule;
