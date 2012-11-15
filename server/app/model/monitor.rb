module Jashboard
  class Monitor
    def initialize(name = nil, refresh_interval = nil)
      @name = name
      @refresh_interval = refresh_interval
    end
    attr_reader :type
    attr_accessor :id, :name, :refresh_interval
  end
end
