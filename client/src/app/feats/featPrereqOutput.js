import 'lodash';

export default function (prereqs) {
  let output = '';
  let uniquePrereqs = []
  let suppressIteration = false;


  function processAttrPrereq (val, key, parentKey, parentIndex, parentLength) {
    let string = '';
    if ( key === 'Feat' || key === 'Other') {
      if ( parentKey === 'any' && parentIndex === parentLength - 1 ) string += ', or  ';
      string += val;
      if ( key === 'Feat' ) string += ' feat ';
      return string;
    }
    const attrStrings = val.map( (attr, x) => {
      let string = '';
      if ( parentKey === 'any' && parentIndex === parentLength - 1 ) string += 'or ';
      if ( key === 'Attribute' ) {
        const attrKey = Object.keys(attr)[0];

        if ( x === val.length - 1 ) {
          string += ` ${ val.length > 1 ? ' or ' : '' }${ attrKey } ${ attr[attrKey] }`
        } else {
          string += `${ attrKey } ${ attr[attrKey] }`;
        }

      } else if ( key === 'Feat' ) {
        string += `${ attr } feat `;
      } else if ( key === 'Other ' ) {
        string += attr;
      }
      return string;
    });
    return attrStrings.join(', ');
  }

  function processPrereqTier (prereq, key, index) {

    let prereqTiers = '';

    if ( key === 'any' ) {
      Object.keys( prereqs[prereq][key] ).forEach( (subKey, subKeyIndex) => {
        prereqTiers += processAttrPrereq( prereqs[prereq][key][subKey], subKey, key, index, prereqs[prereq][key][subKey].length );
      });
    } else {
      prereqTiers += processAttrPrereq( prereqs[prereq][key], key, index, prereqs[prereq][key].length );
    }

    return prereqTiers;
  }

  Object.keys(prereqs).forEach( key => {
    uniquePrereqs.push(prereqs[key]);
  });
  uniquePrereqs = _.uniqWith(uniquePrereqs, _.isEqual);

  if ( Object.keys(prereqs).length > uniquePrereqs.length ) {
    suppressIteration = true;
  }

  Object.keys(prereqs).forEach( (prereq, x) => {

    function processPrereq (key, i, localPrereqKeys, suppressIteration) {

      var output = '';
      if ( i === 0 ) {
        output += `<strong>Tier ${ prereq.split('tier')[1] }`;
        const prereqArray = Object.keys(prereqs);
        // if we're suppressing iteration, get the tier number of the last tier
        // object key and put ` - X` where x is the final tier
        if ( prereqArray.length && suppressIteration ) {
          output += ` - ${ prereqArray[ prereqArray.length - 1 ].split('tier')[1] }`;
        }
        output += `</strong>: `;
      }

      if ( localPrereqKeys.length > 1 && i === 0 ) {
        output += `<ul>`;
      }


      if ( localPrereqKeys.length > 1 && i === 0 ) {
        output += `<li>`;
      }

      output += processPrereqTier(prereq, key, i);

      if ( localPrereqKeys.length > 1 && i > 0 ) {
        output += `</li>`;
      }

      if ( localPrereqKeys.length > 1 && i === localPrereqKeys.length -1  ) {
        output += `</ul>`;
      }

      return output;
    }

    const prereqKeys = Object.keys(prereqs[prereq]);
    const localPrereqKeys = prereqKeys;

    if (suppressIteration && x > 0) {
      return;
    }

    output += '<ul>'

    prereqKeys.forEach( (key, z) => {
      output += `<li>${ processPrereq(key, z, localPrereqKeys, suppressIteration) }</li>`;
    });

    output += '</ul>';
  });

  return output;
}
