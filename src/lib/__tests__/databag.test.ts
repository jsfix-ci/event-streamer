import { lastValueFrom, from, of } from 'rxjs';
import { Databag } from '../databag';
import { toArray, map, concatMap } from 'rxjs/operators';
import { fail } from 'assert';

describe('Databag', () => {
  describe('#wrap', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues);
    it('does not change the amount of data in the observable', async () => {
      const result = await lastValueFrom(obs.pipe(Databag.wrap(), toArray()));
      expect(result).toHaveLength(testValues.length);
    });

    it('wraps around the provided data', async () => {
      const results = await lastValueFrom(obs.pipe(Databag.wrap(), toArray()));
      results.forEach((result, idx) =>
        expect(result).toHaveProperty('data', testValues[idx])
      );
    });
  });

  describe('#unwrap', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap());
    it('does not change the amount of data in the observable', async () => {
      const result = await lastValueFrom(obs.pipe(Databag.unwrap(), toArray()));
      expect(result).toHaveLength(testValues.length);
    });

    it('unwraps the wrapped data', async () => {
      const results = await lastValueFrom(obs.pipe(Databag.unwrap(), toArray()));
      expect(results).toEqual(testValues);
    });
  });

  describe('#rewrap', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues);
    it('rewraps a value using the additional data from another bag', async () => {
      const bag = await lastValueFrom(of(null).pipe(Databag.wrap()));
      bag.set('value', 'test');
      const results = await lastValueFrom(obs.pipe(
        Databag.rewrap(bag),
        toArray()
      ));
      results.forEach(result => expect(result.get('value')).toEqual('test'));
    });
  });

  describe('#inside', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap());
    it('executes the operator and rewraps the data', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.inside(map(val => val + 1)),
        Databag.unwrap(),
        toArray()
      ));
      expect(results).toEqual([2, 3, 4, 5]);
    });

    it('executes async operators and rewraps the data', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.inside(concatMap(val => Promise.resolve(val + 1))),
        Databag.unwrap(),
        toArray()
      ));
      expect(results).toEqual([2, 3, 4, 5]);
    });

    it('keeps additional data after executing the operator', async () => {
      const results = await lastValueFrom(obs.pipe(
        map(val => val.set('value', 'test')),
        Databag.inside(concatMap(val => Promise.resolve(val + 1))),
        toArray()
      ));
      results.forEach(result => expect(result.get('value')).toEqual('test'));
    });
  });

  describe('#insideWithBag', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap(), Databag.set('value', 1));
    it('executes the operator and rewraps the data', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.insideWithBag(bag => map(val => val + bag.get<number>('value'))),
        Databag.unwrap(),
        toArray()
      ));
      expect(results).toEqual([2, 3, 4, 5]);
    });

    it('executes async operators and rewraps the data', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.insideWithBag(bag =>
          concatMap(val => Promise.resolve(val + bag.get<number>('value')))),
        Databag.unwrap(),
        toArray()
      ));
      expect(results).toEqual([2, 3, 4, 5]);
    });

    it('keeps additional data after executing the operator', async () => {
      const results = await lastValueFrom(obs.pipe(
        map(val => val.set('value', 'test')),
        Databag.insideWithBag(bag =>
          concatMap(val => Promise.resolve(val + bag.get<number>('value')))),
        toArray()
      ));
      results.forEach(result => expect(result.get('value')).toEqual('test'));
    });
  });

  describe('#set', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap());
    it('sets a property inside a bag', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.set('value', 'test'),
        toArray()
      ));
      results.forEach(result => expect(result.get('value')).toEqual('test'));
    });
  });

  describe('#setWithBag', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap(), Databag.set('value', 'test'));
    it('sets a property inside a bag', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.setWithBag('value2', bag => `${bag.get('value')}${bag.data}`),
        toArray()
      ));
      results.forEach((result, i) =>
        expect(result.get('value2')).toEqual(`test${i + 1}`));
    });
  });

  describe('#setMany', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap());
    it('sets a property inside a bag', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.setMany({
          value: 'test',
          value2: 'test2'
        }),
        toArray()
      ));
      results.forEach((result) => {
        expect(result.get('value')).toEqual('test');
        expect(result.get('value2')).toEqual('test2');
      });
    });
  });

  describe('#get', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap());
    it('maps to a property inside a bag', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.set('value', 'test'),
        Databag.get('value'),
        toArray()
      ));
      expect(results).toEqual(testValues.map(() => 'test'));
    });
  });

  describe('#modify', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap(), Databag.set('value', 1));
    it('changes a property in the bag', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.modify('value', (value: number) => value - 1),
        Databag.get('value'),
        toArray()
      ));
      expect(results).toEqual(testValues.map(() => 0));
    });

    it('provides the bag as a second parameter', async () => {
      const results = await lastValueFrom(obs.pipe(
        Databag.modify('value', (value: number, bag) => value - bag.get<number>('value')),
        Databag.get('value'),
        toArray()
      ));
      expect(results).toEqual(testValues.map(() => 0));
    });
  });

  describe('#store', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap());
    it('stores the main value in an additional value', async () => {
      const results = await lastValueFrom(obs.pipe(Databag.store('test'), toArray()));
      results.forEach(result => expect(result.get('test')).toEqual(result.data));
    });
  });

  describe('#swap', () => {
    const testValues = [1, 2, 3, 4];
    const obs = from(testValues).pipe(Databag.wrap(), Databag.set('value', 'test'));
    it('stores the main value in an additional value', async () => {
      const results = await lastValueFrom(obs.pipe(Databag.swap('value'), toArray()));
      results.forEach(result => expect(result).toHaveProperty('data', 'test'));
    });
  });

  describe('with errors', () => {
    const testValues = [3, 2, 1, 0];
    const obs = from(testValues).pipe(
      Databag.wrap(),
      Databag.set('value', 'test'),
      Databag.inside(map(v => v ? v : fail('test')))
    );

    it('returns the error wrapped in a databag', async () => {
      const results = lastValueFrom(obs);
      await expect(results).rejects.toEqual(expect.any(Databag));
    });

    it('unwraps the error wrapped in a databag', async () => {
      const results = lastValueFrom(obs.pipe(Databag.unwrap()));
      await expect(results).rejects.toThrow(/test/);
    });

    it('keeps the previous additional data in the error databag', async () => {
      const results = lastValueFrom(obs).catch(e => e.get('value'));
      await expect(results).resolves.toEqual('test');
    });
  });
});
