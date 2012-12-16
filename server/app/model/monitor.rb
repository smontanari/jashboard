module Jashboard
  class Monitor
    attr_accessor :id, :type, :name, :refresh_interval, :configuration, :runtime_info

    def to_json(*args)
      {
        id: @id,
        name: @name,
        type: @type,
        refresh_interval: @refresh_interval,
        configuration: @configuration
      }.to_json(*args)
    end
  end
end
