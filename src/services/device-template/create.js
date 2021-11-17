import Parse from '../../configs/parse-iot';

export default async ({ body }) => {
  try {
    const parameter = body.parameter.map((val) => {
      return new Parse.Query('Parameter').equalTo('objectId', val);
    });

    let findParameter = await Parse.Query.or(...parameter).find();

    const classDeviceTemplate = Parse.Object.extend('DeviceTemplate');
    const createDeviceTemplate = new classDeviceTemplate();
    createDeviceTemplate.set('name', body.name);
    createDeviceTemplate.set('code', body.code);
    createDeviceTemplate.set('interval_secs', body.interval_secs);
    createDeviceTemplate.relation('parameter').add(findParameter);

    const repsData = await createDeviceTemplate.save(null, {
      useMasterKey: true,
    });
    return repsData;
  } catch (error) {
    console.log('error', error);
  }
};
