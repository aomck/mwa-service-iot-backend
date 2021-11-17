import Parse from '../../configs/parse-iot';

export default async ({ deviceTemplateId }) => {
  try {
    const DeviceTemplateObj = Parse.Object.extend('DeviceTemplate');
    const deviceTemplate = new DeviceTemplateObj();
    deviceTemplate.id = deviceTemplateId;
    deviceTemplate.set('isDeleted', true);
    return await deviceTemplate.save();
  } catch (error) {
    console.log('error', error);
  }
};
