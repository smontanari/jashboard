module Jashboard
  class Dashboard
    attr_accessor :id, :name, :monitor_ids

    def initialize(name = nil)
      @name = name
      @monitor_ids = []
    end
  end
end
