import angular from 'angular';
import 'angular-mocks';
import reverseFilterModule from './reverse.filter';
import chai from 'chai';

const expect = chai.expect;

describe('filter: reverse', () => {
  let reverseFilter;

  beforeEach(angular.mock.module(reverseFilterModule.name));

  beforeEach(inject((_reverseFilter_) => {
    reverseFilter = _reverseFilter_;
  }));

  it('reverses the order of a list', () => {
    const firstObj = {};
    const secondObj = {};
    const thirdObj = {};
    const list = [firstObj, secondObj, thirdObj];

    expect(reverseFilter(list)).to.deep.equal([thirdObj, secondObj, firstObj]);
  });

  it('leaves an empty list alone', () => {
    expect(reverseFilter([])).to.deep.equal([]);
  });
});
