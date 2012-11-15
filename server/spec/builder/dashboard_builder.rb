require 'model/dashboard'

module Jashboard
  class DashboardBuilder
    extend BuilderHelper
    builder_for Dashboard
    attr_builder :id, :name
    array_attr_builder :monitor_ids
  end
end
