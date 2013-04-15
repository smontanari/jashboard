module Jashboard
  module Plugin
    module VCS
      VcsRevisionInfo = Struct.new(:revision_id, :date, :author, :message)
    end
  end
end
