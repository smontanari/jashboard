require 'model/monitor'

module Jashboard
  class BuildMonitor < Monitor
    def initialize
      @type = 1
    end
    attr_accessor :ciserver_settings
    def to_json(*args)
      {
        id: @id,
        name: @name,
        type: @type,
        refresh_interval: @refresh_interval,
        ciserver_settings: @ciserver_settings
      }.to_json(*args)
    end
  end
end
