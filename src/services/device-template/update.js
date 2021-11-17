import Parse from '../../configs/parse-iot';

export default async ({ body, deviceTemplateId }) => {
  try {
    const viewDevicetemplate = await new Parse.Query('DeviceTemplate').get(
      deviceTemplateId
    );

    const listParameter = await new Parse.Query('Parameter').find();

    viewDevicetemplate.relation('parameter').remove(listParameter);

    const parameter = body.parameter.map((val) => {
      return new Parse.Query('Parameter').equalTo('objectId', val);
    });

    const findParameter = await Parse.Query.or(...parameter).find();

    // console.log('findParameter ::', findParameter, body);

    viewDevicetemplate.relation('parameter').add(findParameter);
    viewDevicetemplate.set('name', body.name);
    viewDevicetemplate.set('code', body.code);
    viewDevicetemplate.set('interval_secs', body.interval_secs);

    const repsData = await viewDevicetemplate.save(null, {
      useMasterKey: true,
    });
    return repsData;
  } catch (error) {
    console.log('error', error);
  }
};
