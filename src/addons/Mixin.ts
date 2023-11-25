export default {
  inject: ["$hooper"],
};

declare module "vue" {
  interface ComponentCustomProperties {
    $hooper: any;
  }
}
