require 'model/monitor'

module Jashboard
  class BuildMonitor < Monitor
    def initialize
      @type = 1
    end
    attr_accessor :ciserver_settings
  end
end
