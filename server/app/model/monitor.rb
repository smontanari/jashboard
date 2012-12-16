module Jashboard
  class Monitor
    attr_accessor :id, :type, :name, :refresh_interval, :settings, :runtime_info

    def to_json(*args)
      {
        id: @id,
        name: @name,
        type: @type,
        refresh_interval: @refresh_interval,
        settings: @settings
      }.to_json(*args)
    end
  end
end
